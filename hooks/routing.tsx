import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UseRoutingResult {
  pathname: string;
  setParam: (path: string, destination?: string, key?: string) => void;
  switchParamValue: string | null;
}

const useRouting = (): UseRoutingResult => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const switchParamValue = searchParams.get("switch");

  const setParam = (path: string, destination: string = pathname, key: string = "switch") => {
    router.push(`${destination}?${key}=${path}`);
  };

  return {
    pathname,
    setParam,
    switchParamValue,
  };
};

export default useRouting;
