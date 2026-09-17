'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import axios from '@/lib/axios';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // Import GitHub Flavored Markdown
import {
  Link as MuiLink,
  Typography,
//   // CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Divider,
} from '@mui/material';

interface SiteData {
    id: number;
    name: string;
    title: string;
    logo: string;
    color: string | null;
    url: string;
  //   theme: string;
    pages: { id: number; name: string; title: string; path: string }[];
  }
  
interface PageData {
  id: number;
  section_name: string;
  name: string;
  title: string;
//   abstract: { text: string; author?: string; source?: string }[];
  abstract: string | null;
  content: string;
  primary_image: string;
}

interface SectionData {
  label: string | null;
  id: number;
  site_id: number;
  name: string;
  title: string;
//   theme: string;
  pages: { id: number; name: string; title: string; path: string }[];
}

export default function ContentPage() {
  const { site_name, section_name, page_name } = useParams<{ site_name: string; section_name: string; page_name: string }>();
//   const { site_name, section_name, page_name } = useParams();
  const [site, setSite] = useState<SiteData | null>(null);
  const [section, setSection] = useState<SectionData | null>(null);
  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<SectionData[] | null>(null);
  const [pages, setPages] = useState<PageData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   const { name } = params;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null);
    // One response keeps site metadata, menus and content on the same publication.
    axios.get(`/guten/published/sites/${encodeURIComponent(site_name)}/page`, {
      params: { section: section_name, page: page_name }, signal: controller.signal, timeout: 15000,
    }).then(({ data }) => {
      if (controller.signal.aborted) return;
      setSite(data.site); setSection(data.section); setPage(data.page);
      setSections(data.sections); setPages(data.pages);
    }).catch(error => {
      if (!controller.signal.aborted) setError(error.response?.status === 404
        ? "No published page is available at this address." : "Failed to load this page. Please try again later.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [site_name, section_name, page_name]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

//   if (error || !content || !category || !categories) {
  if (error || !page || !site || !section || !sections || !pages) {
        return (
      <Container>
        <Typography variant="h6" color="error">
          {error || 'An unexpected error occurred.'}
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', gap: 3, mt: 2 }}>
      {/* <Typography color="textPrimary">{page.content}</Typography> */}
      {/* Left Sidebar */}
      <Box sx={{ width: '25%', minWidth: 250 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src={site.logo} alt="Logo" style={{ maxWidth: '50%' }} />
        </Box>

        <Box sx={{ bgcolor: 'white', color: site?.color || 'primary.main', padding: 1, mt: 0 }}>
            <Typography variant="h4" gutterBottom>{site.title}</Typography>
        </Box>

        {/* Breadcrumbs (Compressed into Sidebar) */}
        <Box sx={{ mb: 2, fontSize: '0.9rem' }}>
          {/* <MuiLink href="/" color="inherit">{site.title}</MuiLink> */}
          <MuiLink href={`/${site.name}/${section.name}`} color="inherit">{section.title}</MuiLink>
          <Typography color="textPrimary">{page.title}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Left Menu (Subjects) */}
        <List>
          {pages.map((pg) => (
            <ListItem
              key={pg.id}
              component="a"
              href={`/${site.name}/${section.name}/${pg.name}`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { textDecoration: 'underline' },
                fontWeight: pg.name === page.name ? 'bold' : 'normal',
              }}
            >
              <ListItemText primary={pg.title} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1 }}>
        {/* Header with Sectional Menu (Now within content box) */}
        <AppBar position="static" sx={{ width: '100%', bgcolor: site?.color || 'primary.main' }}>
          <Toolbar>
            {sections.map((sec) => (
              <MuiLink
                key={sec.id}
                href={`/${site.name}/${sec.name}`}
                color="inherit"
                underline="none"
                sx={{
                  fontWeight: 'bold',
                //   color: cat.name === section.name ? 'secondary.main' : 'white',
                  marginRight: 2,
                }}
              >
                {sec.label}
              </MuiLink>
            ))}
          </Toolbar>
        </AppBar>

        {/* Image (Full-width in the content box) */}
        <CardMedia
          component="img"
          sx={{ width: '100%', height: 192, mt: 0 }} // 3:1 aspect ratio (1728x576 example)
          image={page.primary_image || '/assets/default.png'}
          alt={page.title}
        />

        {/* Abstract/Quote Section */}
        <Box sx={{ bgcolor: 'white', color: site?.color || 'primary.main', padding: 3, mt: 0 }}>
            <Typography variant="h6" gutterBottom>{page.abstract}</Typography>
        </Box>

        {/* <Box sx={{ mt: 2 }}>
            <ReactMarkdown>{page.content}</ReactMarkdown>
        </Box> */}

        {/* <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
            <ReactMarkdown>{page.content}</ReactMarkdown>
          </Typography>
        </Box> */}

        <Box sx={{ mt: 2, fontSize: '1.2rem', lineHeight: '1.6' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
        </Box>

        {/* Footer (Now inside the content box) */}
        <Box sx={{ marginTop: 4, padding: 2, bgcolor: site?.color || 'primary.main', color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} {site.title} | {site.url} | {' '}
            {/* <MuiLink href={site.url} color="inherit" underline="always">{site.url}</MuiLink> |{' '} */}
            <MuiLink href={site.url} color="inherit" underline="always">info</MuiLink>
            {/* © {new Date().getFullYear()} {site.title} |{' '}
            <MuiLink href="/privacy" color="inherit" underline="always">Privacy Policy</MuiLink> |{' '}
            <MuiLink href="/terms" color="inherit" underline="always">Terms of Use</MuiLink> */}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
