import type { QueryKey } from "@tanstack/react-query"

export default class QueryKeys {
  constructor(private readonly name: string) {}

  all(): QueryKey {
    return [this.name]
  }

  lists(): QueryKey {
    return [...this.all(), "list"]
  }

  list(options?: object): QueryKey {
    return [...this.lists(), options]
  }

  details(): QueryKey {
    return [...this.all(), "detail"]
  }

  detail(options?: object): QueryKey {
    return [...this.details(), options]
  }
}
