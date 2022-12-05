import {
    IAssetsGroupByAssignee,
    IBodyResponse,
    IBulkImportResponse,
    IGetListResponse,
} from '@/common/types';
import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';
import { IImportAssets, IQueryStringAsset } from '../types';

class AssetApiService extends BaseService {
    importAsset(data: IImportAssets): Promise<IBodyResponse<IBulkImportResponse>> {
        return this.client.post(`${this.detailUrl}/bulk-create`, data);
    }

    getAssetsGroupByAssignee(
        query: IQueryStringAsset,
    ): Promise<IBodyResponse<IGetListResponse<IAssetsGroupByAssignee>>> {
        return this.client.get(`${this.detailUrl}/group-by-assignee`, {
            params: query,
        });
    }
}
export const assetService = new AssetApiService({ baseUrl: '/asset' }, service);
