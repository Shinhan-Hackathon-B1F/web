"use client"

import { createClient } from "../../../../shared/utils/supabase/client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Display() {
  const supabase = createClient();
  const router = useRouter();
  
  useEffect(() => {
    const channel = supabase
      .channel("display-channel")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "events" 
        },
        (payload) => {
          console.log(payload)
          if (payload.new) {
            router.push('/count')
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase])
  
  

  return (
    <div>
      <h2>qr 페이지</h2>
    </div>
  );
}
