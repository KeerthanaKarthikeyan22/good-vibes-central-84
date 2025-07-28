import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, AlertCircle, User, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FaceRecognition = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [alarmActive, setAlarmActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported");
      }

      // Check for permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      console.log("Camera permission status:", permissions.state);
      
      if (permissions.state === 'denied') {
        throw new Error("Camera permission denied");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCapturing(true);
      
      toast({
        title: "Camera Started",
        description: "Position your face in the center of the frame",
      });
    } catch (error) {
      console.error("Camera error:", error);
      
      let errorMessage = "Unable to access camera.";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access and try again.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotSupportedError') {
          errorMessage = "Camera not supported by your browser.";
        } else if (error.message === "Camera not supported") {
          errorMessage = "Your browser doesn't support camera access.";
        }
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const registerFace = useCallback(() => {
    // Simulate face registration
    setIsRegistered(true);
    stopCamera();
    toast({
      title: "Face Registered Successfully!",
      description: "Your face has been saved for future recognition.",
    });
  }, [stopCamera, toast]);

  const startAlarm = useCallback(() => {
    if (!isRegistered) {
      toast({
        title: "Registration Required",
        description: "Please register your face first before starting the alarm.",
        variant: "destructive",
      });
      return;
    }
    
    setAlarmActive(true);
    toast({
      title: "Alarm Started",
      description: "Show your face to the camera to stop the alarm.",
    });
    
    // Start camera for face detection
    startCamera();
  }, [isRegistered, startCamera, toast]);

  const stopAlarm = useCallback(() => {
    setAlarmActive(false);
    stopCamera();
    toast({
      title: "Alarm Stopped",
      description: "Face recognition successful! Good morning!",
    });
  }, [stopCamera, toast]);

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Registration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {isRegistered ? (
              <>
                <CheckCircle className="w-5 h-5 text-secondary" />
                <Badge variant="secondary">Registered</Badge>
                <span className="text-sm text-muted-foreground">
                  Face recognition is ready
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-primary" />
                <Badge variant="outline">Not Registered</Badge>
                <span className="text-sm text-muted-foreground">
                  Register your face to use this feature
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Camera Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera View
            </CardTitle>
            <CardDescription>
              {isCapturing ? "Camera is active" : "Click to start camera"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
              {isCapturing ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}
              
              {/* Overlay for face detection area */}
              {isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-primary rounded-full w-48 h-48 border-dashed opacity-50"></div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              {!isCapturing ? (
                <Button onClick={startCamera} variant="hero" className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <Square className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              )}
              
              {isCapturing && !isRegistered && (
                <Button onClick={registerFace} variant="secondary" className="flex-1">
                  Register Face
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle>Alarm Controls</CardTitle>
            <CardDescription>
              Start the face unlock alarm system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Face Detection</span>
                <Badge variant={isRegistered ? "secondary" : "outline"}>
                  {isRegistered ? "Ready" : "Not Ready"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Alarm Status</span>
                <Badge variant={alarmActive ? "destructive" : "outline"}>
                  {alarmActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              {!alarmActive ? (
                <Button 
                  onClick={startAlarm} 
                  variant="hero" 
                  className="w-full"
                  disabled={!isRegistered}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Face Unlock Alarm
                </Button>
              ) : (
                <Button 
                  onClick={stopAlarm} 
                  variant="destructive" 
                  className="w-full"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Alarm
                </Button>
              )}
              
              {!isRegistered && (
                <p className="text-xs text-muted-foreground text-center">
                  Register your face first to enable alarm functionality
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                1
              </div>
              <p className="font-medium">Register Face</p>
              <p className="text-muted-foreground">Start camera and register your face</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                2
              </div>
              <p className="font-medium">Start Alarm</p>
              <p className="text-muted-foreground">Activate the face unlock alarm</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                3
              </div>
              <p className="font-medium">Show Face</p>
              <p className="text-muted-foreground">Present your face to stop the alarm</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};