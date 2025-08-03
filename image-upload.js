// Image Upload Service
// 使用免费的图片托管服务上传图片并获取公共URL

// 使用 imgbb.com 的免费API（需要注册获取API key）
const IMGBB_API_KEY = '5f3c5d9e8b4a7c2e1f9d8b7a6c5e4d3f'; // 这是示例key，需要替换

// 上传图片到imgbb
async function uploadToImgbb(base64Image) {
    try {
        // 移除data URL前缀
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        
        const formData = new FormData();
        formData.append('image', base64Data);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('图片上传失败：' + (data.error?.message || '未知错误'));
        }
    } catch (error) {
        console.error('Upload to imgbb failed:', error);
        throw error;
    }
}

// 使用免费的 Cloudinary 服务（无需API key的临时上传）
async function uploadToCloudinary(base64Image) {
    try {
        // Cloudinary的未签名上传预设（需要在Cloudinary控制台创建）
        const CLOUD_NAME = 'demo'; // 替换为你的cloud name
        const UPLOAD_PRESET = 'ml_default'; // 替换为你的upload preset
        
        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', UPLOAD_PRESET);
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        const data = await response.json();
        
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error('Cloudinary上传失败');
        }
    } catch (error) {
        console.error('Upload to Cloudinary failed:', error);
        throw error;
    }
}

// 使用 0x0.st 免费临时文件托管（无需API key）
async function uploadTo0x0(base64Image) {
    try {
        // 将base64转换为blob
        const response = await fetch(base64Image);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'image.png');
        
        const uploadResponse = await fetch('https://0x0.st', {
            method: 'POST',
            body: formData
        });
        
        const url = await uploadResponse.text();
        return url.trim();
    } catch (error) {
        console.error('Upload to 0x0.st failed:', error);
        throw error;
    }
}

// 使用 tmpfiles.org 临时文件托管
async function uploadToTmpFiles(base64Image) {
    try {
        // 将base64转换为blob
        const response = await fetch(base64Image);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('file', blob, 'doodle.png');
        
        const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await uploadResponse.json();
        
        if (data.status === 'success' && data.data?.url) {
            // 转换URL格式以获取直接链接
            // 从 https://tmpfiles.org/12345/image.png
            // 到 https://tmpfiles.org/dl/12345/image.png
            const url = data.data.url;
            const directUrl = url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            return directUrl;
        } else {
            throw new Error('tmpfiles.org上传失败');
        }
    } catch (error) {
        console.error('Upload to tmpfiles.org failed:', error);
        throw error;
    }
}

// 主上传函数，尝试多个服务
async function uploadImageToPublic(base64Image) {
    console.log('Attempting to upload image to public URL...');
    
    // 尝试按顺序使用不同的服务
    const uploadServices = [
        { name: 'tmpfiles.org', func: uploadToTmpFiles },
        { name: '0x0.st', func: uploadTo0x0 },
        // { name: 'imgbb', func: uploadToImgbb }, // 需要API key
        // { name: 'Cloudinary', func: uploadToCloudinary }, // 需要配置
    ];
    
    for (const service of uploadServices) {
        try {
            console.log(`Trying ${service.name}...`);
            const url = await service.func(base64Image);
            console.log(`Successfully uploaded to ${service.name}: ${url}`);
            return url;
        } catch (error) {
            console.warn(`${service.name} failed:`, error.message);
            continue;
        }
    }
    
    // 如果所有服务都失败了，返回原始的base64
    console.warn('All upload services failed, returning base64 URL');
    return base64Image;
}

// 导出给其他模块使用
if (typeof window !== 'undefined') {
    window.ImageUpload = {
        uploadImageToPublic,
        uploadToTmpFiles,
        uploadTo0x0
    };
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uploadImageToPublic,
        uploadToTmpFiles,
        uploadTo0x0
    };
}