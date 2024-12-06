import { Auth } from "../components/Auth"
import { Qoute } from "../components/Qoute"

export const Signup = () => {
    return <div>
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signup"/>
            </div>
            <div className="visible">
                <Qoute/>
            </div>
            
        </div>
    </div>
}