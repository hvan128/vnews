import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Hàm loại bỏ ký tự đặc biệt không mong muốn
function cleanText(text: string): string {
  return text
    .replace(/[*"'“”‘’!#]+/g, "") // Xóa các ký tự đặc biệt
    .replace(/\s{2,}/g, " ")       // Rút gọn khoảng trắng thừa
    .trim();
}

export async function rewriteArticle({ title, content }: { title: string; content: string }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `Viết lại bài viết sau theo phong cách tự nhiên, dễ hiểu, phù hợp với độc giả Việt Nam. 
  Tiêu đề sát với tiêu đề gốc, hấp dẫn, kích thích người dùng nhấp vào đọc nhưng không giật gân, gây sốc.
  
  Không sử dụng bất kỳ ký tự đặc biệt nào trong tiêu đề hoặc nội dung, bao gồm: *, ", ', !, #, hoặc viết HOA TOÀN BỘ. 
  Không in đậm, không in nghiêng, không chèn định dạng markdown. 
  
  Nội dung cần được giữ đầy đủ thông tin, diễn đạt lại bằng ngôn từ mới, dễ đọc, chia đoạn hợp lý để tăng sự cuốn hút. 
  Không rút gọn quá mức, không thêm nhận xét cá nhân hay thông tin không có trong bài gốc. 
  
  Chỉ trả về kết quả với hai phần: 
  Tiêu đề: ...
  Nội dung: ...
  
  Bài viết gốc:
  Tiêu đề: ${title}
  Nội dung: ${content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Tách tiêu đề và nội dung bằng regex
    const titleMatch = rawText.match(/Tiêu(?:\s|_)đề:\s*(.+)/i);
    const contentMatch = rawText.match(/Nội(?:\s|_)dung:\s*([\s\S]*)/i);

    // Làm sạch dữ liệu sau khi tách
    const rewriteTitle = titleMatch ? cleanText(titleMatch[1]) : "";
    const rewritten = contentMatch ? cleanText(contentMatch[1]) : "";

    return { rewriteTitle, rewritten };
  } catch (error) {
    console.error("Gemini error:", error);
    return { rewriteTitle: "", rewritten: "⚠️ Lỗi khi gọi Gemini API." };
  }
}
