'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function MovieForm() {
    const rawResponse  ="\uD83D\uDD25 <b>Top bài viết có nhiều upvote nhất trong tuần:</b><br><br><b>1. <a href=\\\"/groups/6759d7c4e5bcb70995786267/post/6852c32279307e6239b08e2e\\\" style=\\\"color:#007bff;text-decoration:underline;\\\">asfdasdfasdf</a></b><br>\uD83D\uDC64 <b>Tác giả:</b> Tuấn IT<br>\uD83D\uDC4D <b>Upvotes:</b> 1<br>\uD83D\uDCC5 <b>Ngày tạo:</b> 18/06/2025 20:46<br>\uD83D\uDCDD <b>Nội dung:</b> asdfasdgasgdagd<br><br><b>2. <a href=\\\"/groups/6759d7c4e5bcb70995786267/post/68503490fae54d3ad32b6a96\\\" style=\\\"color:#007bff;text-decoration:underline;\\\">hello</a></b><br>\uD83D\uDC64 <b>Tác giả:</b> Tuấn IT<br>\uD83D\uDC4D <b>Upvotes:</b> 1<br>\uD83D\uDCC5 <b>Ngày tạo:</b> 16/06/2025 22:13<br>\uD83D\uDCDD <b>Nội dung:</b> This is a sample post co...<br><br><b>3. <a href=\\\"/groups/6759d7c4e5bcb70995786267/post/6852c19079307e6239b08b34\\\" style=\\\"color:#007bff;text-decoration:underline;\\\">dddddddddddd</a></b><br>\uD83D\uDC64 <b>Tác giả:</b> Tuấn IT<br>\uD83D\uDC4D <b>Upvotes:</b> 1<br>\uD83D\uDCC5 <b>Ngày tạo:</b> 18/06/2025 20:39<br>\uD83D\uDCDD <b>Nội dung:</b> 234123412351254<br><br><b>4. <a href=\\\"/groups/6759d7c4e5bcb70995786267/post/6851825a20dbe93008f96ebd\\\" style=\\\"color:#007bff;text-decoration:underline;\\\">ssssssssssssssssssssssss...</a></b><br>\uD83D\uDC64 <b>Tác giả:</b> Tuấn IT<br>\uD83D\uDC4D <b>Upvotes:</b> 0<br>\uD83D\uDCC5 <b>Ngày tạo:</b> 17/06/2025 21:57<br>\uD83D\uDCDD <b>Nội dung:</b> ssssssssssssssssssssssss...<br><br><b>5. <a href=\\\"/groups/6759d7c4e5bcb70995786267/post/68518388fe689f0b3eac35b1\\\" style=\\\"color:#007bff;text-decoration:underline;\\\">sdfasdfasdfasdf</a></b><br>\uD83D\uDC64 <b>Tác giả:</b> Tuấn IT<br>\uD83D\uDC4D <b>Upvotes:</b> 0<br>\uD83D\uDCC5 <b>Ngày tạo:</b> 17/06/2025 22:02<br>\uD83D\uDCDD <b>Nội dung:</b> This is a sa<br><br>"

    const decodedResponse = rawResponse.replace(/\\"/g, '"');
    return (
        <>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {decodedResponse}
        </ReactMarkdown>
        </>
    );
}