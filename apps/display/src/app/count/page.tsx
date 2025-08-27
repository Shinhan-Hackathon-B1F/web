import { createClient } from "../../../../../shared/utils/supabase/client";

export default function Display() {
  const supabase = createClient();
  
  return (
    <div>
      <h2>카운트 페이지</h2>
    </div>
  );
}
