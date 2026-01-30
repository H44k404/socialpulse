"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { APP_NAME } from "@/lib/constants";

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // close drawer on navigation
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Menu className="h-4 w-4" />}
          onClick={() => setOpen(true)}
        >
          Menu
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={APP_NAME}
        description="Navigate your command center."
        size="full"
      >
        <div className="space-y-3">
          <Link
            href="/"
            className="glass block rounded-2xl border border-white/10 px-4 py-3 text-sm text-pulse-text hover:bg-white/10"
          >
            Back to Landing
          </Link>
          {/* reuse desktop sidebar UI inside modal */}
          <Sidebar variant="drawer" className="lg:hidden" />
        </div>
      </Modal>
    </>
  );
}

