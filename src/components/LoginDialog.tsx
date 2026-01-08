import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [phone, setPhone] = useState("");
  const [notifyMe, setNotifyMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with phone:", phone, "Notify:", notifyMe);
    // Handle login logic here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-md overflow-hidden border-0">
        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-[#e91e63] via-[#f44336] to-[#ff5722] p-6 text-center text-white relative">
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
            <h3 className="text-xl font-semibold text-gray-900">Unlock Your Offer Now</h3>
            <p className="text-gray-500 text-sm">Smell Good All Day</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                <span className="text-gray-600 text-sm">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={notifyMe}
                onCheckedChange={(checked) => setNotifyMe(checked as boolean)}
                className="data-[state=checked]:bg-[#e91e63] data-[state=checked]:border-[#e91e63]"
              />
              <label
                htmlFor="notify"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Notify me about updates & offers
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff9800] to-[#ff5722] hover:from-[#f57c00] hover:to-[#e64a19] text-white font-semibold py-6 rounded-full text-base"
            >
              Claim My Free Perfume
            </Button>
          </form>

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
