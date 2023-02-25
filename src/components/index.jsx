import React, { useState } from 'react';
import axios from 'axios';

function LinkForm() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('http://localhost:3001/api/shorten', { url });
        setShortUrl("http://localhost:3001/" + response.data.shortUrl);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Nhập đường dẫn:
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                </label>
                <button type="submit">Bọc liên kết</button>
            </form>
            {shortUrl && (
                <p>
                    Đường dẫn ngắn của bạn là: <a href={shortUrl}>{shortUrl}</a>
                </p>
            )}
        </div>
    );
}

export default LinkForm;
