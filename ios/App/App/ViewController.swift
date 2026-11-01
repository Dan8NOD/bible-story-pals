import UIKit
import Capacitor

// Capacitor finds plugins installed from npm by itself; the app's own ones are registered here.
class ViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(PassPlugin())
    }
}
