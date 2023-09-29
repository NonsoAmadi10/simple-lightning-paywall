import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from your server or API here
    // Replace the following example with your actual fetch logic
    fetch('http://localhost:4568/posts') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.data)})
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const [selectedPost, setSelectedPost] = useState({
    pr: "",
    rhash: ""
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  const openModal = (post) => {
    fetch('http://localhost:4568/create/invoice') // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      setSelectedPost({
        pr: data.data.pr,
        rhash: data.data.rhash
      })
    
    })
    .catch((error) => console.error('Error fetching posts:', error));
   
    setModalOpen(true);
  };


  const fetchAdditionalDataAndNavigate = () => {


    // Fetch additional data from the backend for the selected post
    // Replace the following example with your actual fetch logic
    console.log(selectedPost.rhash)
    fetch(`http://localhost:4568/verify-payment?ph=${selectedPost.rhash}`) // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.success) {
          // Navigate to a new page with the post's full details
          setConfirmationSuccess(true)
        } else {
          console.error('Failed to fetch additional data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching additional data:', error);
      });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <h2>New Posts</h2>
      {posts.map((post) => (
        <div key={post._id}>
          <Row>
            <Col xs="8">
              <h4>{post.title}</h4>
            </Col>
            <Col xs="4">
              <Button color="primary" onClick={() => openModal(post)}>
                Read
              </Button>
            </Col>
          </Row>
          <hr />
        </div>
      ))}

      {/* Modal for displaying post content */}
      <Modal isOpen={modalOpen} toggle={closeModal} size="lg">
        <ModalHeader toggle={closeModal}>
          {
            confirmationSuccess && posts[0].title
          }
        </ModalHeader>
        <ModalBody>
        <div style={{ overflowX: 'auto' }}>
            { confirmationSuccess? posts[0].body : selectedPost.pr}
        </div>

        </ModalBody>
        <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button color="primary" onClick={fetchAdditionalDataAndNavigate}>
            I have Paid!
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Posts;

