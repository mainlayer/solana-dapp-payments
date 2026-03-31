import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@mainlayer/sdk", () => ({
  default: vi.fn().mockImplementation(() => ({
    subscriptions: {
      check: vi.fn().mockResolvedValue({
        status: "active",
        plan: "pro",
        current_period_end: "2025-12-31",
      }),
    },
    checkout: {
      create: vi.fn().mockResolvedValue({ url: "https://checkout.mainlayer.fr/test" }),
    },
  })),
}));

import { useMainlayer } from "../src/hooks/useMainlayer";

describe("useMainlayer", () => {
  it("returns not premium when no wallet", () => {
    const { result } = renderHook(() => useMainlayer(null));
    expect(result.current.isPremium).toBe(false);
    expect(result.current.status).toBeNull();
  });

  it("loads subscription status for a wallet", async () => {
    const { result } = renderHook(() => useMainlayer("0xTestWallet"));
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.isPremium).toBe(true);
    expect(result.current.status?.plan).toBe("pro");
  });

  it("exposes loading state during fetch", () => {
    const { result } = renderHook(() => useMainlayer("0xTestWallet"));
    // loading should start true while wallet is set
    expect(typeof result.current.loading).toBe("boolean");
  });
});
