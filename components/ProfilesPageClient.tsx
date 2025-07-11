"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import IconSelector from "@/components/profile-icons/IconSelector";
import { getProfileIcon } from "@/components/profile-icons/ProfileIcons";
import {
  getAllProfiles,
  getActiveProfile,
  setActiveProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  type UserProfile,
  type Account,
} from "@/lib/profile-storage";
import GoogleSignIn from "@/components/GoogleSignIn";

interface ProfilesPageClientProps {
  googleClientId?: string;
}

export default function ProfilesPageClient({ googleClientId }: ProfilesPageClientProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(
    null,
  );
  const [deletingProfile, setDeletingProfile] = useState<UserProfile | null>(
    null,
  );
  const [selectedIcon, setSelectedIcon] = useState("short_brown");
  const [isProfilesLoaded, setIsProfilesLoaded] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Load profiles immediately on mount - don't wait for anything
  useEffect(() => {
    const loadProfiles = () => {
      try {
        const loadedProfiles = getAllProfiles();
        const currentActive = getActiveProfile();
        setProfiles(loadedProfiles);
        setActiveProfileState(currentActive);
        setIsProfilesLoaded(true);
      } catch (error) {
        console.error("Failed to load profiles:", error);
        setIsProfilesLoaded(true); // Still mark as loaded even if there's an error
      }
    };

    // Load immediately, no delays
    loadProfiles();
  }, []);

  // Track when Google is ready
  const handleGoogleReady = () => {
    setIsGoogleReady(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreateProfile = () => {
    if (!profileName.trim()) return;

    createProfile(profileName.trim(), selectedIcon);
    const updatedProfiles = getAllProfiles();
    setProfiles(updatedProfiles);
    setIsCreateDialogOpen(false);
    setProfileName("");
    setSelectedIcon("short_brown");
  };

  const handleEditProfile = (profile: UserProfile) => {
    setEditingProfile(profile);
    setProfileName(profile.name);
    setSelectedIcon(profile.icon);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfile = () => {
    if (!editingProfile || !profileName.trim()) return;

    const updatedProfile = {
      ...editingProfile,
      name: profileName.trim(),
      icon: selectedIcon,
    };

    updateProfile(updatedProfile);
    const updatedProfiles = getAllProfiles();
    setProfiles(updatedProfiles);

    // Update active profile state if we edited the active profile
    if (activeProfile?.id === updatedProfile.id) {
      setActiveProfileState(updatedProfile);
    }

    setIsEditDialogOpen(false);
    setEditingProfile(null);
    setProfileName("");
    setSelectedIcon("short_brown");
  };

  const handleDeleteProfile = () => {
    if (!deletingProfile) return;

    const wasDeleted = deleteProfile(deletingProfile.id);
    if (wasDeleted) {
      const updatedProfiles = getAllProfiles();
      const currentActive = getActiveProfile();
      setProfiles(updatedProfiles);
      setActiveProfileState(currentActive);
    }

    setIsDeleteDialogOpen(false);
    setDeletingProfile(null);
  };

  const handleActivateProfile = (profile: UserProfile) => {
    setActiveProfile(profile.id);
    setActiveProfileState(profile);
  };

  const openDeleteDialog = (profile: UserProfile) => {
    setDeletingProfile(profile);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Profiles
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your learning profiles and switch between them
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        </div>

        {/* Profiles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                activeProfile?.id === profile.id
                  ? "ring-2 ring-blue-500 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50"
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center p-1 bg-white shadow-md">
                      {(() => {
                        const iconData = getProfileIcon(
                          profile.icon || "short_brown",
                        );
                        if (iconData) {
                          const IconComponent = iconData.component;
                          return <IconComponent size={40} />;
                        }
                        return null;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      {activeProfile?.id === profile.id && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProfile(profile)}
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {profiles.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(profile)}
                        className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(profile.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last active: {formatDate(profile.lastActive)}</span>
                  </div>
                </div>

                {activeProfile?.id !== profile.id && (
                  <Button
                    onClick={() => handleActivateProfile(profile)}
                    variant="outline"
                    className="w-full"
                  >
                    Switch to this profile
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cross-Device Sync Section - Only show when Google is ready */}
        {isGoogleReady && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <div className="md:col-span-1">
              <GoogleSignIn
                clientId={googleClientId || ""}
                onSignInSuccess={(account: Account) => {
                  console.log('Successfully signed in:', account);
                  // You can add additional logic here when sign-in succeeds
                }}
                onSignOut={() => {
                  console.log('Successfully signed out');
                  // You can add additional logic here when sign-out occurs
                }}
                onReady={handleGoogleReady}
              />
            </div>
          </div>
        )}

        {/* Hidden GoogleSignIn to trigger loading without rendering */}
        {!isGoogleReady && (
          <div style={{ display: 'none' }}>
            <GoogleSignIn
              clientId={googleClientId || ""}
              onSignInSuccess={() => {}}
              onSignOut={() => {}}
              onReady={handleGoogleReady}
            />
          </div>
        )}

        {/* Empty state - only show when profiles are loaded and empty */}
        {isProfilesLoaded && profiles.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No profiles found
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first profile to get started
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          </div>
        )}
      </div>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-100 to-purple-100 -m-6 mb-4 p-6 rounded-t-lg border-b-2 border-blue-200">
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create New Profile
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label
                htmlFor="profileName"
                className="text-sm font-medium text-gray-700"
              >
                Profile Name
              </Label>
              <Input
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="mt-2 bg-white/70 border-2 border-blue-200 focus:border-purple-400 focus:bg-white transition-all duration-200"
                onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
              />
            </div>
            <IconSelector
              selectedIcon={selectedIcon}
              onIconSelect={setSelectedIcon}
            />
          </div>
          <DialogFooter className="bg-white/50 -m-6 mt-4 p-6 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setProfileName("");
                setSelectedIcon("short_brown");
              }}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={!profileName.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
            >
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-emerald-100 to-teal-100 -m-6 mb-4 p-6 rounded-t-lg border-b-2 border-emerald-200">
            <DialogTitle className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-xl font-bold flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-emerald-600" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label
                htmlFor="editProfileName"
                className="text-sm font-medium text-gray-700"
              >
                Profile Name
              </Label>
              <Input
                id="editProfileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="mt-2 bg-white/70 border-2 border-emerald-200 focus:border-teal-400 focus:bg-white transition-all duration-200"
                onKeyDown={(e) => e.key === "Enter" && handleUpdateProfile()}
              />
            </div>
            <IconSelector
              selectedIcon={selectedIcon}
              onIconSelect={setSelectedIcon}
            />
          </div>
          <DialogFooter className="bg-white/50 -m-6 mt-4 p-6 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingProfile(null);
                setProfileName("");
                setSelectedIcon("short_brown");
              }}
              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={!profileName.trim()}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0"
            >
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the profile "
              {deletingProfile?.name}"? This will permanently remove all
              progress, completed tutorials, and saved code for this profile.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}