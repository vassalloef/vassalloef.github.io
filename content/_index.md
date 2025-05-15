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
  - block: experience
    id: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Experiences.
      #   Add/remove as many `experience` items below as you like.
      #   Required fields are `title`, `company`, and `date_start`.
      #   Leave `date_end` empty if it's your current employer.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - title: Undergraduate Researcher (Particle Theory)
          company: Brigham Young University
          company_url: 'https://physics.byu.edu/'
  #       company_logo: org-byu
          location: Provo, Utah and Granville, Ohio
          date_start: '2023-06-01'
          date_end: '2024-05-01'
          description: |-
            - Completed summer program at BYU with [Dr. Chris Verhaaren](https://physics.byu.edu/department/directory/verhaaren). Collaboration continues as my senior thesis.
            - Studied Q-balls, non-topological solitons arising from scalar fields with applications in dark matter.
            - Developed analytical model for static and rotating Q-balls in two dimensions.
        - title: Undergraduate Researcher (AMO Experiment)
          company: Denison University
          company_url: 'https://denison.edu/academics/physics'
  #       company_logo: org-denison
          location: Granville, Ohio
          date_start: '2021-05-01'
          date_end: '2023-05-31'
          description: |-
            - Worked with [Dr. Wes Walter](https://denison.edu/people/wes-walter) on negative-ion threshold spectroscopy for two years, including two summers.
            - Studied the isotope shifts in the electron affinity of lead, achieving most precise measurements in our lab's history (access paper below).
            - Traveled to colaborate at Stockholm University's [DESIREE facility](https://www.desiree-infrastructure.com/), studying lanthanum anion excited state lifetimes for laser cooling applications.
    design:
      columns: '2'
  #- block: markdown
  #  content:
  #    title: '📚 My Research'
  #    subtitle: ''
  #    text: |-
  #      Use this area to speak to your mission. I'm a research scientist in the Moonshot team at DeepMind. I blog about machine learning, deep learning, and moonshots.
  #
  #      I apply a range of qualitative and quantitative methods to comprehensively investigate the role of science and technology in the economy.
  #      
  #      Please reach out to collaborate 😃
  #  design:
  #    columns: '1'
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
  - block: collection
    id: featured
    content:
      title: Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      columns: '2'
      view: card
  - block: accomplishments
    id: writing
    content:
      # Note: `&shy;` is used to add a 'soft' hyphen in a long heading.
      title: 'Writing'
      subtitle:
      # Date format: https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Accomplishments.
      #   Add/remove as many `item` blocks below as you like.
      #   `title`, `organization`, and `date_start` are the required parameters.
      #   Leave other parameters empty if not required.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
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
  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        Don't hesitate to reach out.
      email: fevassallo@wisc.edu
  #- block: collection
  #  content:
  #    title: Recent Publications
  #    text: ""
  #    filters:
  #      folders:
  #        - publication
  #      exclude_featured: false
  #  design:
  #    view: citation
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
  #      <a class="github-button" href="https://github.com/HugoBlox/hugo-blox-builder" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star HugoBlox/hugo-blox-builder on GitHub">Star</a>
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
