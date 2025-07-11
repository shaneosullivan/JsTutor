import ProfilesPageClient from "@/components/ProfilesPageClient";

export default function ProfilesPage() {
  // Get Google Client ID from environment variable on server side
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  return <ProfilesPageClient googleClientId={googleClientId} />;
}
