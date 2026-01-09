import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "phone" | "phone-otp" | "profile" | "email-otp" | "success";

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [notifyMe, setNotifyMe] = useState(true);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      console.log("Sending OTP to:", phone);
      setStep("phone-otp");
    }
  };

  const handlePhoneOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length === 6) {
      console.log("Phone OTP verified:", phoneOtp);
      setStep("profile");
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email) {
      console.log("Sending email OTP to:", email);
      setStep("email-otp");
    }
  };

  const handleEmailOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length === 6) {
      console.log("Email verified! User registered:", { phone, username, email });
      setStep("success");
    }
  };

  const handleBack = () => {
    switch (step) {
      case "phone-otp":
        setStep("phone");
        setPhoneOtp("");
        break;
      case "profile":
        setStep("phone-otp");
        break;
      case "email-otp":
        setStep("profile");
        setEmailOtp("");
        break;
      default:
        break;
    }
  };

  const resetAndClose = () => {
    setStep("phone");
    setPhone("");
    setPhoneOtp("");
    setUsername("");
    setEmail("");
    setEmailOtp("");
    onOpenChange(false);
  };

  const getStepTitle = () => {
    switch (step) {
      case "phone":
        return "Unlock Your Offer Now";
      case "phone-otp":
        return "Verify Your Phone";
      case "profile":
        return "Complete Your Profile";
      case "email-otp":
        return "Verify Your Email";
      case "success":
        return "Welcome to RIMAÉ!";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case "phone":
        return "Smell Good All Day";
      case "phone-otp":
        return `Enter the 6-digit code sent to +91 ${phone}`;
      case "profile":
        return "Tell us a bit about yourself";
      case "email-otp":
        return `Enter the 6-digit code sent to ${email}`;
      case "success":
        return "Your account has been created successfully!";
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="p-0 gap-0 max-w-md overflow-hidden border-0">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-[#e91e63] via-[#f44336] to-[#ff5722] p-6 text-center text-white relative">
          {step !== "phone" && step !== "success" && (
            <button
              onClick={handleBack}
              className="absolute left-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <DialogHeader className="space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white text-[#e91e63] font-bold text-lg px-2 py-1 rounded">
                <span className="block text-xs">MY</span>
                <span className="block text-xs">OP</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium tracking-wider">MAKE YOUR</p>
                <p className="text-xs font-medium tracking-wider">OWN PERFUME</p>
              </div>
            </div>
            
            {/* Promo Text */}
            <div>
              <h2 className="text-3xl font-bold">Buy 2 Get 1 Free!</h2>
              <p className="text-white/90 text-sm mt-1">Sign in now to claim</p>
            </div>
          </DialogHeader>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-t-3xl -mt-4 relative z-10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h3>
            <p className="text-gray-500 text-sm">{getStepSubtitle()}</p>
          </div>

          {/* Step 1: Phone Input */}
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                  <Phone className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-600 text-sm">+91</span>
                </div>
                <Input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify"
                  checked={notifyMe}
                  onCheckedChange={(checked) => setNotifyMe(checked as boolean)}
                  className="data-[state=checked]:bg-[#e91e63] data-[state=checked]:border-[#e91e63]"
                />
                <label htmlFor="notify" className="text-sm text-gray-600 cursor-pointer">
                  Notify me about updates & offers
                </label>
              </div>

              <Button
                type="submit"
                disabled={phone.length < 10}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base disabled:opacity-50"
              >
                Send OTP
              </Button>
            </form>
          )}

          {/* Step 2: Phone OTP Verification */}
          {step === "phone-otp" && (
            <form onSubmit={handlePhoneOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={phoneOtp}
                  onChange={(value) => setPhoneOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button type="button" className="text-[#e91e63] font-medium hover:underline">
                  Resend OTP
                </button>
              </p>

              <Button
                type="submit"
                disabled={phoneOtp.length !== 6}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base disabled:opacity-50"
              >
                Verify Phone
              </Button>
            </form>
          )}

          {/* Step 3: Profile (Username & Email) */}
          {step === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                type="submit"
                disabled={!username || !email.includes("@")}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base disabled:opacity-50"
              >
                Verify Email
              </Button>
            </form>
          )}

          {/* Step 4: Email OTP Verification */}
          {step === "email-otp" && (
            <form onSubmit={handleEmailOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={emailOtp}
                  onChange={(value) => setEmailOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button type="button" className="text-[#e91e63] font-medium hover:underline">
                  Resend OTP
                </button>
              </p>

              <Button
                type="submit"
                disabled={emailOtp.length !== 6}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base disabled:opacity-50"
              >
                Complete Registration
              </Button>
            </form>
          )}

          {/* Step 5: Success */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Welcome, <strong>{username}</strong>!</p>
                <p className="text-sm text-gray-500 mt-1">You can now claim your Buy 2 Get 1 Free offer.</p>
              </div>
              <Button
                onClick={resetAndClose}
                className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base"
              >
                Start Shopping
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex gap-2">
              <a href="#" className="hover:underline">T&C</a>
              <span>|</span>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Secured by <strong className="text-gray-700">RIMAÉ</strong></span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
