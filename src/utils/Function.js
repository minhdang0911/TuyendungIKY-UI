export const formatName = (name) => {
    return name
        .toLowerCase() // Chuyển thành chữ thường
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
        .replace(/[áàảãạăắẳẵặâấầẩẫậ]/g, 'a') // Thay các dấu tiếng Việt thành chữ cái không dấu
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/[đ]/g, 'd');
};
