---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    id: about
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
    design:
      css_class: dark
      background:
        color: black
        image:
          # Add your image background to `assets/media/`.
          filename: stacked-peaks.svg
          filters:
            brightness: 1.0
          size: cover
          position: center
          parallax: false
  - block: markdown
    id: research
    content:
      title: 'My Research'
      subtitle: ''
      text: |-
        I am interested in the areas of high energy phenomenology, cosmology, and astroparticle physics, which means that I want to understand the evolution of the universe mostly through the interactions of its most fundamental components—particles.

        My previous work includes studying dark matter models that could accumulate in the center of the Sun as well as exploring objects called Q-balls which could be at the center of various models of dark matter and baryogenesis.
    design:
      columns: '1'
  #- block: collection
  #  id: papers
  #  content:
  #    title: Featured Publications
  #    filters:
  #      folders:
  #        - publication
  #      featured_only: true
  #  design:
  #    view: article-grid
  #    columns: 2
  - block: accomplishments
    id: writing
    content:
      title: 'Writing'
      subtitle:
      date_format: Jan 2006
      items:
        - certificate_url: ''
          date_end: ''
          date_start: '2023-06-01'
          description: "Feared by some and admired by others, math has shaped our lives in ways beyond imagination. In this academic article, I explore the effects of powerful math on one of history's most fascinating conflicts: the modern synthesis of biology."
          icon: org-harvard
          organization: "Featured by Harvard University's Synthesis"
          organization_url: https://histsci.fas.harvard.edu/synthesis
          title: "Powerful Math: What Biology's Modern Synthesis Reveals About the Twofold Nature of Math"
          url: https://indd.adobe.com/view/54a9817d-9641-4a0c-8944-7f4e6f5b4fca
        - certificate_url: ''
          date_end: ''
          date_start: '2023-08-01'
          description: "Join me in the latest issue of Radiations to recap my experience presenting research at PhysCon 2022, a trip that was loaded with fun events and outings in Washington, DC."
          icon: org-aip
          organization: "Featured by AIP's Radiations"
          organization_url: https://www.aip.org/
          title: "Science Comes to Life at PhysCon"
          url: https://www.sigmapisigma.org/sigmapisigma/radiations/issues/spring-2023
        - certificate_url: ''
          date_end: ''
          date_start: '2022-05-01'
          description: "It is the stories of the people around us that most deserve the spotlight. In this profile, I tell the story of my grandmother—from her family’s escape from a flood in her childhood to the charming story of how she met my grandfather."
          icon: org-denison
          organization: "Featured by Denison University's Exile"
          organization_url: https://digitalcommons.denison.edu/exile/
          title: "The calm amidst the storm"
          url: https://digitalcommons.denison.edu/exile/vol68/iss1/29/
    design:
      columns: '2'
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
  #- block: collection
  #  id: talks
  #  content:
  #    title: Recent & Upcoming Talks
  #    filters:
  #      folders:
  #        - event
  #  design:
  #    view: article-grid
  #    columns: 1
  #- block: collection
  #  id: news
  #  content:
  #    title: Recent News
  #    subtitle: ''
  #    text: ''
  #    # Page type to display. E.g. post, talk, publication...
  #    page_type: post
  #    # Choose how many pages you would like to display (0 = all pages)
  #    count: 5
  #    # Filter on criteria
  #    filters:
  #      author: ""
  #      category: ""
  #      tag: ""
  #      exclude_featured: false
  #      exclude_future: false
  #      exclude_past: false
  #      publication_type: ""
  #    # Choose how many pages you would like to offset by
  #    offset: 0
  #    # Page order: descending (desc) or ascending (asc) date.
  #    order: desc
  #  design:
  #    # Choose a layout view
  #    view: date-title-summary
  #    # Reduce spacing
  #    spacing:
  #      padding: [0, 0, 0, 0]
  #- block: cta-card
  #  demo: true # Only display this section in the Hugo Blox Builder demo site
  #  content:
  #    title: 👉 Build your own academic website like this
  #    text: |-
  #      This site is generated by Hugo Blox Builder - the FREE, Hugo-based open source website builder trusted by 250,000+ academics like you.
  #
  #      <a class="github-button" href="https://github.com/HugoBlox/hugo-blox-builder" data-color-scheme="no-preference: light; light: light; #dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star HugoBlox/hugo-blox-builder on GitHub">Star</a>
  #
  #      Easily build anything with blocks - no-code required!
  #      
  #      From landing pages, second brains, and courses to academic resumés, conferences, and tech blogs.
  #    button:
  #      text: Get Started
  #      url: https://hugoblox.com/templates/
  #  design:
  #    card:
  #      # Card background color (CSS class)
  #      css_class: "bg-primary-700"
  #      css_style: ""
---