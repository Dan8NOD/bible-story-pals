import Foundation
import Capacitor
import StoreKit

// The 12-hour pass the game sells once its free minutes are used up (js/pass.js).
// It is an App Store non-renewing subscription. Paid time is worked out from the App
// Store's signed transactions every time it's asked for, so a pass survives a
// reinstall and shows up on the family's other devices, and the app keeps no record
// of its own and sends nothing anywhere.
@objc(PassPlugin)
public class PassPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PassPlugin"
    public let jsName = "Pass"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "product", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "buy", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
    ]

    static let productID = "com.dancruz.biblestorypals.pass12h"
    static let length: TimeInterval = 12 * 60 * 60

    private var updates: Task<Void, Never>?

    override public func load() {
        // Ask to Buy approvals and purchases made on another device arrive here.
        updates = Task.detached {
            for await result in Transaction.updates {
                if case .verified(let transaction) = result { await transaction.finish() }
            }
        }
    }

    deinit { updates?.cancel() }

    // When paid play ends. Passes bought back to back stack: each starts when the
    // one before it ends. Refunded passes don't count.
    static func paidUntil() async -> Date? {
        var starts: [Date] = []
        for await result in Transaction.all {
            guard case .verified(let transaction) = result,
                  transaction.productID == productID,
                  transaction.revocationDate == nil else { continue }
            starts.append(transaction.purchaseDate)
        }
        return starts.sorted().reduce(nil as Date?) { end, start in
            max(end ?? start, start).addingTimeInterval(length)
        }
    }

    // JavaScript timestamps are milliseconds; 0 means never paid.
    static func until() async -> [String: Any] {
        ["until": ((await paidUntil())?.timeIntervalSince1970 ?? 0) * 1000]
    }

    @objc func status(_ call: CAPPluginCall) {
        Task { call.resolve(await Self.until()) }
    }

    @objc func product(_ call: CAPPluginCall) {
        Task {
            let product = try? await Product.products(for: [Self.productID]).first
            call.resolve(["available": product != nil, "price": product?.displayPrice ?? ""])
        }
    }

    @objc func buy(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [Self.productID]).first else {
                    return call.reject("The 12-hour pass isn't available from the App Store yet.", "UNAVAILABLE")
                }
                switch try await product.purchase() {
                case .success(let result):
                    guard case .verified(let transaction) = result else {
                        return call.reject("The App Store couldn't verify this purchase.", "UNVERIFIED")
                    }
                    await transaction.finish()
                    call.resolve(await Self.until())
                case .pending:
                    call.resolve(["pending": true])
                case .userCancelled:
                    call.resolve(["cancelled": true])
                @unknown default:
                    call.resolve(["cancelled": true])
                }
            } catch {
                call.reject(error.localizedDescription, "FAILED")
            }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
            } catch {
                return call.reject(error.localizedDescription, "FAILED")
            }
            call.resolve(await Self.until())
        }
    }
}
