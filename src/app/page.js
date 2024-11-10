import TweetList from '../components/TweetList'

export default function Home() {
  const userId = 'michaelsheen';

  return (
    <div>
      <main>
        <TweetList userId={userId}/>
      </main>
      <footer>
        <h3>contact</h3>
      </footer>
    </div>
  );
}
