import * as React from 'react'

import { GigaProps } from './lib/components/GigaProps';
import { GigaGrid, GigaState } from './lib/components/GigaGrid';
import { AggregationMethod, ColumnDef, FormatInstruction, SortDirection, BucketInfo, ColumnFormat } from './lib/models/ColumnLike';
import {Row} from './lib/models/Row';
import {CellRenderer} from './lib/components/Cell/CellRenderer';
import {CellProps} from './lib/components/Cell/Cell';

declare module 'giga-grid' {
    export { GigaGrid, GigaProps, CellProps, GigaState, AggregationMethod, ColumnDef, FormatInstruction, SortDirection, BucketInfo, ColumnFormat, Row }
}