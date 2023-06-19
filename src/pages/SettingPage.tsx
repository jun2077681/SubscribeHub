import DeleteIcon from '@mui/icons-material/Delete';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Alert, Button, FormControl, InputLabel, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';

import Header from '@/components/Header/Header';
import useGetKeywords from '@/hooks/apis/useGetKeywords';
import useGetSites from '@/hooks/apis/useGetSites';
import useGetUserSites from '@/hooks/apis/useGetUserSites';
import type { UserSite } from '@/hooks/apis/useSearchUserSites';
import useSearchUserSites from '@/hooks/apis/useSearchUserSites';
import useSetKeywords from '@/hooks/apis/useSetKeywords';
import useSetUserSites from '@/hooks/apis/useSetUserSites';

import type { SelectChangeEvent } from '@mui/material';
import type { SyntheticEvent } from 'react';

const defaultTheme = createTheme();

type TabValue = 'site' | 'keyword';
const SettingSitePanel = () => {
  const siteList = useGetSites();

  const userSiteList = useGetUserSites();
  const { searchUserSite } = useSearchUserSites();
  const { setUserSites } = useSetUserSites();
  const [updateUserSiteList, setUpdateUserSiteList] = useState(userSiteList ?? []);

  const [siteId, setSiteId] = useState<string>('1');
  const [userSiteIdx, setUserSiteIdx] = useState<string>('0');
  const [searchResult, setSearchResult] = useState<UserSite[]>([]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const searchRef = useRef<HTMLInputElement>(null);
  const handleChangeSite = (event: SelectChangeEvent) => {
    try {
      setSiteId(event.target.value);
    } catch (e) {
      console.error(e, event.target.value);
    }
  };

  const handleChangeUserSite = (event: SelectChangeEvent) => {
    setUserSiteIdx(event.target.value);
  };

  const addUserSite = () => {
    const data = searchResult[parseInt(userSiteIdx)];
    if (!data || !data.siteId || !data.url || !data.nickname) return;
    if (updateUserSiteList.some((v) => v.siteId === data.siteId && v.url === data.url && v.nickname === data.nickname))
      return;
    setUpdateUserSiteList([...updateUserSiteList, data]);
  };

  const removeUserSite = ({ url }: UserSite) => {
    setUpdateUserSiteList([...updateUserSiteList].filter((site) => site.url.trim() !== url.trim()));
  };

  const handleSearchUserSites = async () => {
    const searchWord = searchRef.current?.value ?? '';
    if (!searchWord) {
      return;
    }
    const result = await searchUserSite({ siteId: parseInt(siteId), searchWord });
    setSearchResult(result);
  };

  const handleSave = () => {
    setUserSites(updateUserSiteList, {
      onSuccess: () => {
        setOpenAlert(true);
      },
    });
  };

  return (
    <TabPanel value="site">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <List sx={{ width: '100%', maxWidth: 360, maxHeight: 300, overflow: 'auto', bgcolor: grey['50'] }}>
            {updateUserSiteList.map(({ siteId, nickname, url }) => {
              const labelId = `checkbox-list-label-${url}`;

              return (
                <ListItem
                  key={url}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeUserSite({ siteId, nickname, url })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText id={labelId} primary={nickname} secondary={url} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={8} sm={4}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">사이트</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={siteId}
              label="사이트"
              onChange={handleChangeSite}
            >
              {(siteList ?? []).map((site) => {
                return (
                  <MenuItem key={site.id} value={site.id}>
                    {site.siteNickname}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8} sm={4}>
          <TextField
            disabled={!siteId}
            inputRef={searchRef}
            id="search"
            name="search"
            label="검색어"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Button onClick={handleSearchUserSites} size="small" variant="contained" sx={{ mt: 3, ml: 1 }}>
            검색
          </Button>
        </Grid>
        {searchResult.length > 0 && (
          <>
            <Grid item xs={12} sm={8}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">사이트</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={userSiteIdx}
                  label="검색 결과"
                  onChange={handleChangeUserSite}
                >
                  {searchResult.map((userSite, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {userSite.nickname}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={2}>
              <Button onClick={addUserSite} size="small" variant="contained" sx={{ mt: 3, ml: 1 }}>
                추가
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSave} variant="contained" sx={{ mt: 3, ml: 1 }}>
          저장
        </Button>
      </Box>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          저장되었습니다.
        </Alert>
      </Snackbar>
    </TabPanel>
  );
};

const SettingKeywordsPanel = () => {
  const keywords = useGetKeywords();
  const keywordRef = useRef<HTMLInputElement>(null);
  const [updatedKeywordList, setUpdateKeywordList] = useState<string[]>(keywords ?? []);
  const { setKeywords } = useSetKeywords();

  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };
  const addKeywords = () => {
    const newKeyword = keywordRef.current?.value ?? '';
    if (newKeyword === '' || updatedKeywordList.includes(newKeyword)) return;

    setUpdateKeywordList([...updatedKeywordList, newKeyword]);
  };

  const removeKeywords = (target: string) => {
    setUpdateKeywordList(updatedKeywordList.filter((keyword) => keyword !== target));
  };

  const handleSave = () => {
    setKeywords(updatedKeywordList, {
      onSuccess: () => {
        setOpenAlert(true);
      },
    });
  };

  return (
    <TabPanel value="keyword">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <List sx={{ width: '100%', maxWidth: 360, maxHeight: 300, overflow: 'auto', bgcolor: grey['50'] }}>
            {updatedKeywordList.map((keyword) => {
              const labelId = `checkbox-list-label-${keyword}`;

              return (
                <ListItem
                  key={keyword}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeKeywords(keyword)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText id={labelId} primary={keyword} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField inputRef={keywordRef} id="keyword" name="keyword" label="키워드" fullWidth variant="standard" />
        </Grid>
        <Grid item xs={4} sm={2}>
          <Button onClick={addKeywords} size="small" variant="contained" sx={{ mt: 3, ml: 1 }}>
            추가
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSave} variant="contained" sx={{ mt: 3, ml: 1 }}>
          저장
        </Button>
      </Box>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          저장되었습니다.
        </Alert>
      </Snackbar>
    </TabPanel>
  );
};

const SettingPage = () => {
  const [value, setValue] = useState<TabValue>('site');

  const handleChange = (event: SyntheticEvent, newValue: TabValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <Header />
      <Container component="main" maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Setting
          </Typography>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="대상 사이트 설정" value="site" />
                <Tab label="알람 키워드 설정" value="keyword" />
              </TabList>
            </Box>
            <SettingSitePanel />
            <SettingKeywordsPanel />
          </TabContext>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SettingPage;
