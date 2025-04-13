type TableOfContentsProps = {
    content: string;
  };
  
  export function TableOfContents({ content }: TableOfContentsProps) {
    // Logic to extract headings would go here in a real implementation
    
    if (content.length <= 2000) {
      return null;
    }
    
    return (
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100 mx-6 lg:mx-8">
        <h3 className="text-lg font-medium mb-2">Mục lục</h3>
        <ul className="text-blue-600 text-sm space-y-1 ml-4">
          <li className="hover:underline cursor-pointer">1. Hạt óc chó - Món ăn vặt lành mạnh</li>
          <li className="hover:underline cursor-pointer">2. Dầu ô liu - Thần dược tim mạch</li>
          <li className="hover:underline cursor-pointer">3. Hạt mè - Trợ thủ kiểm soát đường huyết</li>
          <li className="hover:underline cursor-pointer">4. Quả bơ - Bạn thân của người tiểu đường</li>
          <li className="hover:underline cursor-pointer">5. Cá hồi - Thực phẩm giàu omega-3</li>
        </ul>
      </div>
    );
  }