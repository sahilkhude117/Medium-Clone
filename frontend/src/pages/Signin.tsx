import { Auth } from "../components/Auth"
import { Qoute } from "../components/Qoute"

export const Signin = () => {
    return <div>
        <div className="grid grid-cols-2">
            <div>
                <Auth type="signin"/>
            </div>
            <div className="visible">
                <Qoute/>
            </div>
            
        </div>
    </div>
}