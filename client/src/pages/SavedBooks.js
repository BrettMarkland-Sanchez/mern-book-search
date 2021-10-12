import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { userQuery } from '../utils/queries';
import { dropBook } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(userQuery);
  const [removeBook, { error }] = useMutation(dropBook);
  const userData = data?.me || {};
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
      if (!token) { return false };
    try { 
      await removeBook({ variables: { bookId }});
      removeBookId( bookId );
    } catch (error) { console.error(error) }
  };

  if (loading) { return <h2>LOADING...</h2> };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book?.bookId} border='dark'>
                {book?.image ? <a href={book?.link || "#a"} target="_blank" rel="noopener noreferrer"><Card.Img src={`https:${book?.image}`||'#a'} alt={`The cover for ${book?.title}`} variant='top' /></a> : null}
                <Card.Body>
                  <Card.Title><a href={book?.link || "#a"} target="_blank" rel="noopener noreferrer">{book?.title}</a></Card.Title>
                  <p className='small'>Authors: {book?.authors}</p>
                  <Card.Text>{book?.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book?.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">
          {error.message}
        </div>
      )}
    </>
  );
};

export default SavedBooks;