<template>
    <BaseTableLayout
        :data="assetList"
        :objectSpanMethod="objectSpanMethod"
        :border="true"
    >
        <template #table-columns>
            <el-table-column
                prop="assignee.fullName"
                :label="$t('asset.list.fields.assignee')"
                min-width="170"
            />
            <el-table-column
                prop="name"
                :label="$t('asset.list.fields.name')"
                min-width="150"
            />
            <el-table-column
                :label="$t('asset.list.fields.purchaseDate')"
                min-width="150"
            >
                <template #default="scope">
                    <span>{{ parseDateTime(scope.row.purchaseDate) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('asset.list.fields.assetCategory')"
                min-width="150"
            >
                <template #default="scope">
                    <span>{{ getAssetCategory(scope.row.category) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="code"
                :label="$t('asset.list.fields.code')"
                min-width="200"
            />
            <el-table-column
                prop="assetType"
                :label="$t('asset.list.fields.assetType')"
                min-width="150"
            >
                <template #default="scope">
                    <span>{{
                        $t(`asset.list.fieldsValues.assetType.${scope.row.type}`)
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="usingStatus"
                :label="$t('asset.list.fields.usingStatus')"
                min-width="150"
            >
                <template #default="scope">
                    <span>{{
                        $t(`asset.list.filterForm.usingStatus.${scope.row.usingStatus}`)
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                :label="$t('asset.list.fields.price')"
                min-width="180"
            >
                <template #default="scope">
                    <span>
                        {{ parseMoney(scope.row.price) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                :label="$t('asset.list.fields.description')"
                min-width="180"
            />
        </template>
    </BaseTableLayout>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component';
import { assetModule } from '@/modules/asset/store/asset.store';
import { IAsset, IRowSpan } from '../../types';
import { appModule } from '@/store/app';
import { SupportLanguage } from '@/common/constants';
import { UtilMixins } from '@/mixins/utilMixins';
export default class AssigneeTable extends mixins(UtilMixins) {
    get assetList(): IAsset[] {
        const assets: IAsset[] = [];
        assetModule.assetsGroupByAssignee.forEach((assetGroupByAssignee) => {
            assetGroupByAssignee.assets.forEach((asset) => {
                assets.push({
                    ...asset,
                    assignee: {
                        id: assetGroupByAssignee.assigneeId,
                        fullName: assetGroupByAssignee.fullName,
                    },
                });
            });
        });
        return assets;
    }

    objectSpanMethod(row: IRowSpan): unknown {
        if (row.columnIndex === 0) {
            const assigneeId = row.row?.assignee?.id as number;
            if (
                row?.rowIndex === 0 ||
                assigneeId !== this.assetList[row?.rowIndex - 1]?.assignee?.id
            ) {
                return {
                    rowspan: assetModule.assetsGroupByAssignee.find(
                        (assetGroupByAssignee) =>
                            assigneeId === assetGroupByAssignee.assigneeId,
                    )?.assets.length,
                    colspan: 1,
                };
            } else {
                return {
                    rowspan: 0,
                    colspan: 0,
                };
            }
        }
        return {
            rowspan: 1,
            colspan: 1,
        };
    }

    getAssetCategory(category: string): string {
        const currentCategory = assetModule.categories.find((cate) => {
            return cate.code === category;
        });
        const currentLanguage = appModule.selectedLanguage as SupportLanguage;
        return currentCategory?.value?.[currentLanguage] || '';
    }
}
</script>

<style lang="scss" scoped>
.status-field {
    font-size: 14px;
    width: 100px;
}
.el-table-column {
    width: 25% !important;
}

:deep(.cell) {
    padding-left: 10px !important;
}
</style>
