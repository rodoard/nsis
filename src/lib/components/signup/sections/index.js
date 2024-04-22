import FaceStylization from "./FaceStylization.svelte"
import HandGesture from "./HandGesture.svelte"
import SecureGesture from "./SecureGesture.svelte"

export default sectionComponent
const components = {
    face_stylization: FaceStylization,
    hand_gesture: HandGesture,
    secure_gesture: SecureGesture,
}
function sectionComponent(section) {
    return components[section]
}  