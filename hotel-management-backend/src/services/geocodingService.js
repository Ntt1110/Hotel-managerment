const AppError = require("../utils/AppError");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "GrandHaiDangHotelApp/1.0 (contact@granhaidang.vn)";
const TIMEOUT_MS = 8000;

let lastCallAt = 0;

async function throttle() {
  const elapsed = Date.now() - lastCallAt;
  const waitMs = 1100 - elapsed;
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastCallAt = Date.now();
}

async function rawGeocode(query) {
  await throttle();

  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new AppError("Dich vu dinh vi phan hoi qua lau, vui long thu lai sau", 504);
    }
    throw new AppError(
      "Khong the ket noi toi dich vu dinh vi, kiem tra lai ket noi mang cua server",
      503
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new AppError(`Dich vu dinh vi tra ve loi (HTTP ${res.status})`, 502);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new AppError("Dich vu dinh vi tra ve du lieu khong hop le", 502);
  }

  if (!data || data.length === 0) {
    throw new AppError("KHONG_TIM_THAY", 422);
  }

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function ensureCountryHint(address) {
  const lower = address.toLowerCase();
  if (lower.includes("việt nam") || lower.includes("vietnam")) {
    return address;
  }
  return `${address}, Việt Nam`;
}

function stripHouseNumber(address) {
  return address.replace(/^(?:[\d]+[\dA-Za-z/\-]*\s+)+/, "").trim();
}

function expandAbbreviations(address) {
  return address
    .replace(/\bp\.?\s?(\d{1,3})\b/gi, "phường $1")
    .replace(/\bq\.?\s?(\d{1,3})\b/gi, "quận $1");
}

async function geocodeAddress(address) {
  const trimmed = address.trim();
  const simplified = expandAbbreviations(stripHouseNumber(trimmed));

  const candidates = [ensureCountryHint(trimmed)];
  if (simplified && simplified.toLowerCase() !== trimmed.toLowerCase()) {
    candidates.push(ensureCountryHint(simplified));
  }

  let lastNotFoundError = null;

 for (const candidate of candidates) {
    try {
      const result = await rawGeocode(candidate);
      // LOG TAM THOI - de biet chinh xac ung vien nao da thanh cong, xoa sau khi debug xong
      console.log(`[geocode] THANH CONG voi: "${candidate}" -> lat=${result.lat}, lng=${result.lng}`);
      return result;
    } catch (err) {
     if (err.statusCode && err.statusCode !== 422) {
        throw err;
      }
      // LOG TAM THOI - xoa sau khi debug xong
      console.log(`[geocode] THAT BAI voi: "${candidate}" (422 - khong tim thay)`);
      lastNotFoundError = err;
    }
  }

  throw new AppError(
    "Khong tim thay toa do cho dia chi nay. Thu bo bot so nha/hem, chi giu ten duong + phuong/quan + thanh pho.",
    422
  );
}

module.exports = { geocodeAddress };