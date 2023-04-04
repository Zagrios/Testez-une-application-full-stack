import { run as runSession } from "./session.cy";
import { run as runLogin } from "./login.cy";
import { run as runRegister } from "./register.cy";
import { run as runProfile } from "./profile.cy";

runLogin();
runRegister();
runProfile();
runSession();