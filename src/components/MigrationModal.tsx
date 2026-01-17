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
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const MigrationModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user: authUser, signInWithGoogle } = useAuth();
    const { user: localUser, clearUser } = useUser();
    const { toast } = useToast();

    useEffect(() => {
        // Check if we have a legacy local user BUT no authenticated user
        // And ensure we rely on the fact that AuthContext loads session asynchronously
        // We wait for authUser loading? AuthContext should handle loading state.
        // Assuming this component is rendered inside App where AuthProvider is active.

        // We only trigger if:
        // 1. Local Legacy User exists (has ID and Name)
        // 2. Auth User is NULL (not logged in via Google)
        // 3. We are not in a "just logged out" state (maybe handled by checking localUser existence)

        if (localUser && !authUser) {
            // Check if this local user is actually a "legacy" one (e.g. created before migration)
            // Or simply ANY local user that hasn't linked Google.
            // Based on req: "Old users... guid login... otherwise visitor".
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [localUser, authUser]);

    const handleMigrationLogin = async () => {
        // Trigger Google Login
        // The actual migration logic happens ON LOGIN SUCCESS (in AuthContext or App).
        // Here we just initiate login.
        await signInWithGoogle();
    };

    const handleClearLegacy = () => {
        // Clear local storage -> Visitor Mode
        clearUser();
        setIsOpen(false);
        toast({
            title: "已切換至訪客模式",
            description: "舊有紀錄已清除。",
        });
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>系統安全升級通知</AlertDialogTitle>
                    <AlertDialogDescription>
                        為了提供更完善的遊戲體驗與資料安全，我們已全面升級登入系統。請使用 Google 帳號進行綁定，系統將自動為您完整遷移所有歷史積分與成就紀錄。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 text-center sm:text-right">
                    <AlertDialogAction onClick={handleMigrationLogin} className="w-full sm:w-auto">
                        立即綁定 Google
                    </AlertDialogAction>
                    <AlertDialogCancel onClick={handleClearLegacy} className="w-full sm:w-auto hover:bg-secondary hover:text-secondary-foreground text-muted-foreground border-border">
                        放棄紀錄回到訪客
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
