describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST',
      'http://localhost:3003/api/users',
      {
        username: 'Test',
        name: 'Tester',
        password: '1234'
      })
    cy.request('POST',
      'http://localhost:3003/api/users',
      {
        username: 'Test2',
        name: 'Tester2',
        password: '1234'
      })
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Test')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()
      cy.contains('Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Test')
      cy.get('#password').type('12345')
      cy.get('#login-button').click()
      cy.contains('Wrong username/password')
      cy.contains('username')
      cy.contains('password')
      cy.contains('login')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Test', password: '1234' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('Title')
      cy.get('#author').type('Author')
      cy.get('#url').type('url.com')
      cy.contains('create').click()
      cy.contains('Created new blog: Title by Author')
      cy.contains('Title Author')
    })

    describe('And a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Title',
          author: 'Author',
          url: 'url.com'
        })
      })

      it('The blog can be liked', function() {
        cy.contains('show').click()
        cy.contains('like').click()
        cy.contains('likes: 1')
      })

      it('The blog can be removed', function() {
        cy.contains('show').click()
        cy.contains('remove').click()
        cy.contains('Title Author').should('not.exist')
      })

      it('The blog only shows remove button to the user that created the blog', function() {
        cy.contains('show').click()
        cy.contains('remove')
        cy.login({ username: 'Test2', password: '1234' })
        cy.contains('show').click()
        cy.contains('remove').should('not.exist')
      })

      // Using ":nth-child" here is a bit finnicky but works here (as long as no content
      // is added before the list of blogs in the page)
      it('The blogs should be in an order such that the most liked one is first', function() {
        cy.createBlog({
          title: 'Another',
          author: 'Someone else',
          url: 'another.com'
        })
        // Open the extended info for both blogs
        cy.get(':nth-child(4) > :nth-child(1)').contains('show').click()
        cy.get(':nth-child(4) > :nth-child(2)').contains('show').click()
        // Check that the first blog in the list contains the title and author of the first one added
        cy.get(':nth-child(4) > :nth-child(1)').contains('Title Author')

        // Like the second blog
        cy.get(':nth-child(4) > :nth-child(2)').contains('like').click()

        // The second blog should now be the first on the list
        cy.get(':nth-child(4) > :nth-child(1)').contains('Another Someone else')

        // Like the first added blog twice
        cy.get(':nth-child(4) > :nth-child(2)').contains('like').click()
        cy.get(':nth-child(4) > :nth-child(2)').contains('likes: 1')
        cy.get(':nth-child(4) > :nth-child(2)').contains('like').click()

        // The first added blog should now be the first on the list
        cy.get(':nth-child(4) > :nth-child(1)').contains('Title Author')
      })
    })
  })
})