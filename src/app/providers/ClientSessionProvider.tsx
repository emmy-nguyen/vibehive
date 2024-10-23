"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ClientSessionProviderProps {
  children: ReactNode;
  session?: any;
}

const ClientSessionProvider: React.FC<ClientSessionProviderProps> = ({
  children,
  session,
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default ClientSessionProvider;
