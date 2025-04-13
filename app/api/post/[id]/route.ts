import { NextApiRequest, NextApiResponse } from 'next';
import Post from '../../../../models/Post';
import { connectToDatabase } from '../../../../lib/mongodb';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { id } = req.query;
    const { facebookPosted, facebookPostId, facebookPostTime } = req.body;

    try {
        await connectToDatabase();


        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                facebookPosted,
                facebookPostId,
                facebookPostTime
            },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
        }

        return res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái Facebook:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
}