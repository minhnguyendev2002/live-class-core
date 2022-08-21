export class Util{
  static removeVietnamese(str: string): string {
    if (!str) {
      return ""
    }
    const from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    return str;
  }
}