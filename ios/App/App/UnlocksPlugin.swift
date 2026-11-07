import Foundation
import Capacitor
import StoreKit

// The one-time purchases that unlock stories and worlds (js/unlocks.js). What a family
// owns is read from the App Store's signed transactions every time it's asked for, so
// purchases survive a reinstall and show up on their other devices, refunds lock again,
// and the app keeps no record of its own and sends nothing anywhere.
@objc(UnlocksPlugin)
public class UnlocksPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UnlocksPlugin"
    public let jsName = "Unlocks"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "products", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "buy", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
    ]

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

    static func owned() async -> [String: Any] {
        var ids: [String] = []
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result, transaction.revocationDate == nil else { continue }
            ids.append(transaction.productID)
        }
        return ["owned": ids]
    }

    @objc func status(_ call: CAPPluginCall) {
        Task { call.resolve(await Self.owned()) }
    }

    // The App Store's localized price for each product it can sell.
    @objc func products(_ call: CAPPluginCall) {
        let ids = call.getArray("ids", String.self) ?? []
        Task {
            let products = (try? await Product.products(for: ids)) ?? []
            var prices: [String: Any] = [:]
            for product in products { prices[product.id] = product.displayPrice }
            call.resolve(["prices": prices])
        }
    }

    @objc func buy(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            return call.reject("No product was named.", "UNAVAILABLE")
        }
        Task {
            do {
                guard let product = try await Product.products(for: [id]).first else {
                    return call.reject("This isn't available from the App Store yet.", "UNAVAILABLE")
                }
                switch try await product.purchase() {
                case .success(let result):
                    guard case .verified(let transaction) = result else {
                        return call.reject("The App Store couldn't verify this purchase.", "UNVERIFIED")
                    }
                    await transaction.finish()
                    call.resolve(await Self.owned())
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
            call.resolve(await Self.owned())
        }
    }
}
