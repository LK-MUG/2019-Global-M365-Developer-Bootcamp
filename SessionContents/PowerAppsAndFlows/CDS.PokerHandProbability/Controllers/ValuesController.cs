using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CDS.PokerHandProbability.Controllers
{
    public class ValuesController : ApiController
    {

        // POST api/values
        public IEnumerable<ResponseMessage> Post([FromBody]int value)
        {
            pokerodd pok = new pokerodd();

            return pok.GeneratePridctionwithcards(value);
        }

        //GET api/values
        public IEnumerable<MyCards> Get(int value)
        {
            pokerodd pok = new pokerodd();

            return pok.CardDetails(value);
        }

    }

    public class pokerodd
    {

        public List<ResponseMessage> GeneratePridctionwithcards(int handcards)

        {
            const int DEC_PLACES = 2;
            const int SIMS_TO_RUN = 100000;
            var rand = new Random();
            var hand = new List<Card>();
            var numCards = handcards;
            for (int i = 0; i < numCards; i++)
                hand.Add(new Card((Rank)rand.Next(13) + 1, (Suit)rand.Next(4)));
            //Time odds calculation
            OddsCalculator calculator = new OddsCalculator();
            float[] odds = calculator.RunSimulations(hand, SIMS_TO_RUN);
            List<ResponseMessage> respmsg = new List<ResponseMessage>();
            respmsg.Add(new ResponseMessage { SLNO = "1", CardType = "High Card:", CardValue = Math.Round(odds[0], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "2", CardType = "Pair:", CardValue = Math.Round(odds[1], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "3", CardType = "Two Pair:", CardValue = Math.Round(odds[2], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "4", CardType = "Three of a Kind:", CardValue = Math.Round(odds[3], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "5", CardType = "Straight:", CardValue = Math.Round(odds[4], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "6", CardType = "Flush:", CardValue = Math.Round(odds[5], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "7", CardType = "Full House:", CardValue = Math.Round(odds[6], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "8", CardType = "Four of a Kind:", CardValue = Math.Round(odds[7], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "9", CardType = "Straight Flush:", CardValue = Math.Round(odds[8], DEC_PLACES) + " %".ToString() });
            respmsg.Add(new ResponseMessage { SLNO = "10", CardType = "Royal Flush:", CardValue = Math.Round(odds[9], DEC_PLACES) + " %".ToString() });
            return respmsg;
        }

        public List<MyCards> CardDetails(int cardno)
        {
            int val = 0;
            List<MyCards> mycards = new List<MyCards>();
            if (cardno <= 7)
            {
                
                var rand = new Random();
                var hand = new List<Card>();
                var numCards = cardno;
                for (int i = 0; i < numCards; i++)
                    hand.Add(new Card((Rank)rand.Next(13) + 1, (Suit)rand.Next(4)));
                foreach (Card c in hand)
                {
                    val = val + 1;
                    if (c.IsKnown)
                    {
                        mycards.Add(new MyCards { SLNO = val, CardDetails = c.ToString() });
                    }

                }
            }
            else
            {
                mycards.Add(new MyCards { SLNO = 1, CardDetails = "More than 7 cards are not allowed" });

            }
            return mycards;
        }
    }

    public class PokerPridction
    {
        public List<ResponseMessage> Response { get; set; }
    }

    public class ResponseMessage
    {
        public string SLNO { get; set; }
        public string CardType { get; set; }
        public string CardValue { get; set; }
    }

    public class CardDetails
    {
        public List<MyCards> YourCards { get; set; }

    }

    public class MyCards
    {
        public int SLNO { get; set; }
        public string CardDetails { get; set; }

    }
}
