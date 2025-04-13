import fetch from "node-fetch";
import * as cheerio from "cheerio";

// Hàm tạo slug từ tiêu đề
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Cấu hình Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const rewrite = async ({ title, content }: { title: string; content: string }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Viết lại bài viết dưới đây theo cách tự nhiên, dễ đọc, phù hợp với người Việt Nam.\nTiêu đề: ${title}\nNội dung:\n${content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const newContent = await response.text();
    return newContent;
  } catch (err) {
    console.error("Gemini rewrite error:", err);
    return null;
  }
};

const crawlAndRewrite = async () => {
  const res = await fetch("https://vnexpress.net/");
  const html = await res.text();
  const $ = cheerio.load(html);

  const links: string[] = [];

  $(".title-news a").each((_, el) => {
    const link = $(el).attr("href");
    if (link && !links.includes(link) && link.startsWith("https://vnexpress.net/")) {
      links.push(link);
    }
  });

  for (const link of links.slice(0, 5)) {
    try {
      
    } catch (err) {
      console.error("❌ Lỗi crawl bài:", err);
    }
  }
};

// Chạy thủ công hoặc định kỳ (5 phút/lần)
crawlAndRewrite(); // Gọi ngay khi chạy file

// Hoặc bật cron:
// cron.schedule("*/5 * * * *", crawlAndRewrite);
