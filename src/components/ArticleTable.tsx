import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, TableSortLabel } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';

import { useArticleContext } from '@/context/ArticleContext';
import useGetArticleContents from '@/hooks/apis/useGetArticleContents';
import type { ArticleContent } from '@/hooks/apis/useGetArticles';

import type { ChangeEvent, MouseEvent } from 'react';
import type { TableComponents } from 'react-virtuoso';

interface ColumnData {
  dataKey: keyof ArticleContent;
  label: string;
  alignTitle?: 'center' | 'left' | 'right';
  alignContents?: 'center' | 'left' | 'right';
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 120,
    label: '사이트',
    dataKey: 'nickname',
    alignTitle: 'center',
    alignContents: 'center',
  },
  {
    width: 200,
    label: '게시물 제목',
    dataKey: 'title',
    alignTitle: 'center',
  },
  {
    width: 100,
    label: '글쓴이',
    dataKey: 'writer',
    alignTitle: 'center',
  },
  {
    width: 120,
    label: '작성일',
    dataKey: 'written_date',
    alignTitle: 'center',
    alignContents: 'center',
  },
  {
    width: 60,
    label: '조회수',
    dataKey: 'viewCount',
    alignTitle: 'center',
    alignContents: 'center',
  },
  {
    width: 60,
    label: '추천수',
    dataKey: 'recommendCount',
    alignTitle: 'center',
    alignContents: 'center',
  },
  {
    width: 60,
    label: '댓글수',
    dataKey: 'commentCount',
    alignTitle: 'center',
    alignContents: 'center',
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ViewContents = ({ article }: { article: ArticleContent }) => {
  const { isLoading: isLoadingArticleContents, getArticleContents } = useGetArticleContents();
  const [contents, setContents] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getContents().then();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const getContents = async () => {
    const result = await getArticleContents({ id: article.articleId });
    setContents(result);
  };

  return (
    <>
      <Grid item xs={2}>
        <IconButton edge="end" onClick={handleClick}>
          <ExpandMoreIcon />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          {isLoadingArticleContents ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography sx={{ p: 2 }} maxWidth={360} maxHeight={300}>
              <div
                style={{ width: '100%', overflow: 'hidden', wordBreak: 'break-all' }}
                dangerouslySetInnerHTML={{ __html: contents }}
              />
              <Button onClick={() => window.open(article.url, '_blank')}>원문</Button>
            </Typography>
          )}
        </Popover>
      </Grid>
    </>
  );
};

function ArticleTable() {
  const { articles } = useArticleContext();

  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof ArticleContent>('written_date');
  const [filterBy, setFilterBy] = useState<string>('');

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof ArticleContent) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterBy(event.target.value);
  };

  const createSortHandler = (property: keyof ArticleContent) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  const rows = stableSort(
    articles.filter((article) => article.title.includes(filterBy)),
    getComparator(order, orderBy),
  );

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.alignTitle}
            style={{ width: column.width }}
            sx={{
              backgroundColor: 'background.paper',
            }}
            sortDirection={orderBy === column.dataKey ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.dataKey}
              direction={orderBy === column.dataKey ? order : 'asc'}
              onClick={createSortHandler(column.dataKey)}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function RowContent(_index: number, row: ArticleContent) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell key={column.dataKey} align={column.alignContents}>
            <Grid width="100%" container spacing={1}>
              {column.dataKey === 'title' && <ViewContents article={row} />}
              <Grid item xs={10} display="flex" alignItems="center">
                {row[column.dataKey]}
              </Grid>
            </Grid>
          </TableCell>
        ))}
      </React.Fragment>
    );
  }

  const VirtuosoTableComponents: TableComponents<ArticleContent> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
  };

  return (
    <Paper style={{ height: 600, width: '100%' }}>
      <Grid container spacing={3} width="100%" display="flex" justifyContent="center" marginBottom={5}>
        <Grid item xs={12} sm={8}>
          <TextField
            onChange={handleRequestFilter}
            id="filter"
            name="filter"
            label="제목 필터링"
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={RowContent}
      />
    </Paper>
  );
}

export default ArticleTable;
