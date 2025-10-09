import SecurityAnalysis from "@/components/security-analysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from 'next/image';

export default function DashboardPage() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

    return (
    <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                     {userAvatar && (
                        <Image
                            src={userAvatar.imageUrl}
                            alt={userAvatar.description}
                            data-ai-hint={userAvatar.imageHint}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    )}
                 </CardHeader>
                 <CardContent>
                    <div className="text-2xl font-bold text-primary">Verified</div>
                    <p className="text-xs text-muted-foreground">
                        Your voice print is active and secure.
                    </p>
                 </CardContent>
            </Card>
        </div>
        <div>
            <SecurityAnalysis />
        </div>
    </>
    );
}
