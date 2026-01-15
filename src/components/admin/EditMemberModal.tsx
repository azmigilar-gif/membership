"use client";

import React from "react";
import MemberForm from "./MemberForm";

type Props = {
  user: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
};

export default function EditMemberModal({ user, open, onClose, onUpdated }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Member</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <MemberForm
          userId={typeof user._id === 'string' ? user._id : String(user._id)}
          initialValues={{
            benefit: user.benefit || user.membership_tier,
            free_play_hours: user.free_play_hours || 0,
            overnight_rentals_used: user.overnight_rentals_used || 0,
          }}
          onSuccess={() => {
            if (onUpdated) onUpdated();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
