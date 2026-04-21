import { DEFAULT_PAGE } from "@/constans";
import { MeetingStatus } from "@/modules/meetings/types";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

export const useMeetingsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
