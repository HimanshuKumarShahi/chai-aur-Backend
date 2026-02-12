import express from 'express';

const app=express();

app.get('/api/jokes',(req,res)=>{
   const jokes = [
  { id: 1, title: "The Bug", content: "Why do programmers prefer dark mode? Because light attracts bugs!" },
  { id: 2, title: "Cache Problem", content: "Why did the server go broke? Because it ran out of cache." },
  { id: 3, title: "Hardware Issue", content: "How many developers does it take to change a lightbulb? None. That's a hardware problem." },
  { id: 4, title: "Private Classes", content: "Why did the private class break up? Because they never saw each other." },
  { id: 5, title: "Java Vision", content: "Why do Java developers wear glasses? Because they don’t see sharp." },
  { id: 6, title: "Recursion", content: "To understand recursion, you must first understand recursion." },
  { id: 7, title: "Arrays", content: "Why did the developer quit his job? Because he didn’t get arrays." },
  { id: 8, title: "Linux Submarine", content: "Why do submarines run Linux? Because you can’t open Windows underwater." },
  { id: 9, title: "Silly Question", content: "What happens when developers ask a silly question? They get a silly ANSI." },
  { id: 10, title: "Raise Confusion", content: "Why did the programmer quit? Because he didn’t get a raise." },
  { id: 11, title: "Dark Mode Preference", content: "Why do Python programmers prefer dark mode? Because light attracts bugs." },
  { id: 12, title: "Comforting Bugs", content: "How do you comfort a JavaScript bug? You console it." },
  { id: 13, title: "Nature and Bugs", content: "Why do programmers hate nature? It has too many bugs." },
  { id: 14, title: "Hangout Place", content: "What is a programmer’s favorite hangout place? Foo Bar." },
  { id: 15, title: "Holiday Mixup", content: "Why do programmers confuse Christmas and Halloween? Because Oct 31 == Dec 25." },
  { id: 16, title: "Big Hit", content: "How did the developer announce their new song? It was a big hit in C#." },
  { id: 17, title: "Expressing Sadness", content: "Why was the JavaScript developer sad? Because he didn’t Node how to Express himself." },
  { id: 18, title: "Seeing Sharp", content: "Why do Java developers wear glasses? Because they can’t C#." },
  { id: 19, title: "Hobbyte", content: "What do you call eight hobbits? A hobbyte." },
  { id: 20, title: "Computer Health", content: "Why can’t computers catch cold? Because they have good bytes." }
];

 res.send(jokes);
});

const port=3000

app.listen(port,()=>{
    console.log(`server at http://Localhost:${port}`);
});