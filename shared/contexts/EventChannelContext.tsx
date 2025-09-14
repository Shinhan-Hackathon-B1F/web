"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "../utils/supabase/client";
import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { Event } from "../types";

export interface EventPayload {
  new: Event;
  old?: Event;
  eventType?: "INSERT" | "UPDATE" | "DELETE" | "SYNC";
}

type EventCallback = (payload: EventPayload) => void;

interface EventChannelContextType {
  isConnected: boolean;
  event: Event | null;
  syncEventData: () => Promise<void>;
  eventId: number;
}

interface EventChannelProviderProps {
  children: ReactNode;
  eventId?: number;
}

const EventChannelContext = createContext<EventChannelContextType | undefined>(
  undefined
);

// 전역 변수들
let globalChannel: RealtimeChannel | null = null;
const subscribers = new Set<EventCallback>();

export function EventChannelProvider({
  children,
  eventId = 1,
}: EventChannelProviderProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [event, setEvent] = useState<Event | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 채널이 없으면 생성
    if (!globalChannel) {
      console.log("🔌 이벤트 채널 생성");

      globalChannel = supabase
        .channel("event-updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "events",
            filter: `id=eq.${eventId}`,
          },
          (payload) => {
            console.log("📨 이벤트 업데이트:", payload);

            if (payload.new) {
              const eventData = payload.new as Event;
              const oldEventData = payload.old as Event;
              setEvent(eventData);

              // 모든 구독자들에게 브로드캐스트
              subscribers.forEach((callback) => {
                try {
                  callback({
                    new: eventData,
                    old: oldEventData,
                    eventType: payload.eventType || "UPDATE",
                  });
                } catch (error) {
                  console.error("구독자 콜백 에러:", error);
                }
              });
            }
          }
        )
        .on("system", {}, (payload) => {
          console.log("🔄 연결 상태 변경:", payload.type);
          const connected = payload.type === "opened";
          setIsConnected(connected);

          // 재연결되었을 때 최신 이벤트 동기화
          if (connected) {
            syncEventData();
          }
        })
        .subscribe();
    }

    // 초기 데이터 로드
    syncEventData();

    return () => {
      // 구독자가 없으면 채널 정리
      if (subscribers.size === 0 && globalChannel) {
        console.log("🔌 이벤트 채널 정리");
        globalChannel.unsubscribe();
        globalChannel = null;
      }
    };
  }, [supabase, eventId]);

  // 서버에서 최신 이벤트 상태 가져오기
  const syncEventData = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;

      console.log("🔄 이벤트 동기화 완료:", data);
      const eventData = data as Event;
      setEvent(eventData);

      // 구독자들에게도 알림
      subscribers.forEach((callback) => {
        callback({
          new: eventData,
          eventType: "SYNC",
        });
      });
    } catch (error) {
      console.error("이벤트 동기화 실패:", error);
    }
  };

  const value: EventChannelContextType = {
    isConnected,
    event,
    syncEventData,
    eventId,
  };

  return (
    <EventChannelContext.Provider value={value}>
      {children}
    </EventChannelContext.Provider>
  );
}

export function useEventChannel(
  callback?: EventCallback,
  dependencies: React.DependencyList = []
): EventChannelContextType {
  const context = useContext(EventChannelContext);

  if (!context) {
    throw new Error(
      "useEventChannel must be used within an EventChannelProvider"
    );
  }

  useEffect(() => {
    if (callback && typeof callback === "function") {
      console.log("👂 이벤트 구독자 등록");
      subscribers.add(callback);

      return () => {
        console.log("👋 이벤트 구독자 해제");
        subscribers.delete(callback);
      };
    }
  }, dependencies);

  return context;
}
