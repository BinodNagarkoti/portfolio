import { Navigation } from "components/Layout/Navigation";
import ScrollToTop from "components/Layout/ScrollToTop";
import NowPlaying from "components/NowPlaying";
import { ExternalLinkProps, StringProps } from "lib/types";

import { Flex, StyledContainer } from "components/Layout/Container/styles";
import {
  FlexLinks, FooterContainer,
  GridContainer
} from "components/Layout/Footer/styles";

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a target="_blank" rel="noopener noreferrer" href={href}>
    {children}
  </a>
);

export const Footer = ({ darkTheme }: StringProps) => {
  return (
    <FooterContainer darkTheme={darkTheme}>
      <StyledContainer>
        <Flex justify="center" direction="column">
          <hr />
          <NowPlaying />
          <GridContainer>
            <FlexLinks>
              <Navigation href="/" text="Home" />
              <Navigation href="/blog" text="Blog" />
              <Navigation href="/testimonials" text="Testimonials" />
            </FlexLinks>
            <FlexLinks>
              <ExternalLink href="https://twitter.com/BinodDNagarkoti">
                Twitter
              </ExternalLink>
              <ExternalLink href="https://github.com/BinodNagarkoti">
                GitHub
              </ExternalLink>
              <ExternalLink href="https://www.linkedin.com/in/binod-nagarkoti-496245128/">
                LinkedIn
              </ExternalLink>
            </FlexLinks>
            <FlexLinks>
              <ExternalLink href="https://www.linkedin.com/in/binod-nagarkoti-496245128/">
                Download
              </ExternalLink>
              <Navigation href="/top-tracks" text="Top Tracks" />
            </FlexLinks>
          </GridContainer>
          <ScrollToTop darkTheme={darkTheme} />
        </Flex>
      </StyledContainer>
    </FooterContainer>
  );
};
