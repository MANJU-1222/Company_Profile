import axios from "axios";
import { apiBase } from "../../contants/api";

class PdfService {
  private apiPath = apiBase;

  public async getPdfById(id: string) {
    const response = await axios.get(`${this.apiPath}/pdf/${id || ""}`, {
      responseType: "blob",
    });
    return response.data;
  }

  public async filterPdfByTags(id: string, tags: string[]) {
    const response = await axios.post(
      `${this.apiPath}/pdf/${id || ""}/filter-by-tags`,
      {
        tags: tags,
      }
    );
    return response.data;
  }

  public async getPdfByIdAndPageNos(id: string, pageNos: number[]) {
    const response = await axios.post(
      `${this.apiPath}/pdf/${id || ""}/download`,
      {
        pageNumbers: pageNos,
      },
      {
        responseType: "blob",
      }
    );
    return response.data;
  }
}

export default PdfService;
