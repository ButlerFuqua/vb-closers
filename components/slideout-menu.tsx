"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "@/hooks/use-theme"
import { useAuth } from "@/hooks/use-auth"
import { Menu, Sun, Moon, Monitor, LogOut, User } from "lucide-react"
import Image from "next/image"

export function SlideoutMenu() {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <Image src="/vb-closers-logo.png" alt="VB Closers" width={40} height={40} />
            <SheetTitle className="text-xl font-bold">VB Closers</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
            <User className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Sales Closer</p>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Theme</Label>
            <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center space-x-2 cursor-pointer">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center space-x-2 cursor-pointer">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center space-x-2 cursor-pointer">
                  <Monitor className="h-4 w-4" />
                  <span>System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t">
            <Button onClick={handleSignOut} variant="outline" className="w-full justify-start bg-transparent" size="lg">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
