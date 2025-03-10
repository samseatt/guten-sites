'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import axios from '@/lib/axios';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'; // Import GitHub Flavored Markdown
import {
  Breadcrumbs,
  Link as MuiLink,
  Typography,
//   Card,
  // CardContent,
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
  abstract: string[];
  content: string[];
  primary_image: string;
}

interface SectionData {
  id: number;
  site_id: number;
  name: string;
  title: string;
//   theme: string;
  pages: { id: number; name: string; title: string; path: string }[];
}

export default function ContentPage({ params }: { params: { site_name: string, section_name: string, page_name: string } }) {
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
    const fetchData = async () => {
      try {
        setLoading(true);

        // Await resolution of `params`
        const resolvedParams = await params;
        const { site_name } = resolvedParams;
        const { section_name } = resolvedParams;
        const { page_name } = resolvedParams;

        console.log('Page being rendered with: ', site_name, section_name, page_name);
        
        // Fetch site details
        const siteResponse = await axios.get(`/guten/sites/${site_name}`);
        if (siteResponse.data != null) {
            setSite(siteResponse.data);
        } else {
            setError(`Site details not found for site: ${site_name}`);
        }

        // Fetch section details
        const sectionResponse = await axios.get(`/guten/sections/${section_name}?site=${site_name}`);
        if (sectionResponse.data != null) {
            setSection(sectionResponse.data);
        } else {
            setError(`Section details not found for section: ${section_name}`);
        }
        
        // Fetch page details
        const pageResponse = await axios.get(`/guten/pages/${page_name}?site=${site_name}&section=${section_name}`);
        if (pageResponse.data != null) {
          setPage(pageResponse.data);
        } else {
          setError(`Content not found for page: ${page_name}`);
        }

        // Fetch site sections
        const sectionsResponse = await axios.get(`/guten/sections?site=${site_name}`);
        if (sectionsResponse.data != null) {
          setSections(sectionsResponse.data);
        } else {
          setError(`Sections were not found for site: ${site_name}`);
        }
    
        // Fetch section pages
        const pagesResponse = await axios.get(`/guten/pages?site=${site_name}&section=${section_name}`);
        if (pagesResponse.data != null) {
          setPages(pagesResponse.data);
        } else {
          setError(`Pages were not found for section: ${section_name}`);
        }    
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

//   if (error || !content || !category || !categories) {
  if (error || !page) {
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
            {/* <MuiLink href="{site.url}" color="inherit" underline="always">{site.url}</MuiLink> |{' '} */}
            <MuiLink href="{site.url}" color="inherit" underline="always">info</MuiLink>
            {/* © {new Date().getFullYear()} {site.title} |{' '}
            <MuiLink href="/privacy" color="inherit" underline="always">Privacy Policy</MuiLink> |{' '}
            <MuiLink href="/terms" color="inherit" underline="always">Terms of Use</MuiLink> */}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
