
import { FiduScan } from "../src/index";
import { AuthenticationError, RateLimitError } from "../src/errors";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("FiduScan SDK", () => {
  let sdk: FiduScan;

  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockedAxios as any);
    sdk = new FiduScan({ apiKey: "test_key" });
  });

  it("should successfully detect an image", async () => {
    mockedAxios.request.mockResolvedValueOnce({
      data: { fake_probability: 0.99 },
      status: 200,
    });

    const res = await sdk.detection.detectImage(Buffer.from("data"));
    expect(res).toEqual({ fake_probability: 0.99 });
  });

  it("should throw AuthenticationError on 401", async () => {
    mockedAxios.request.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 401, data: { detail: "Invalid key" } },
    });

    await expect(sdk.cases.createCase("T", "D")).rejects.toThrow(AuthenticationError);
  });

  it("should throw RateLimitError on 429", async () => {
    mockedAxios.request.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 429, data: { detail: "Too many" } },
    });

    await expect(sdk.blockchain.createAnchor("ev_123")).rejects.toThrow(RateLimitError);
  });
});
