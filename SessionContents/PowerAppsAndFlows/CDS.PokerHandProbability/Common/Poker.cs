using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CDS.PokerHandProbability
{
    public class Poker
    {
        public string GeneratePridctionwithcards(int handcards)

        {
            string CardType =null;
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
            foreach (Card c in hand)
                if (c.IsKnown)
             CardType = CardType + c.ToString() + ", ";
           List<ResponseMessage> respmsg = new List<ResponseMessage>();
            respmsg.Add(new ResponseMessage { SLNO= "1", CardType = "UR Card Details:"+ CardType, CardValue = 0 });
            respmsg.Add(new ResponseMessage { SLNO = "2", CardType = "High Card:", CardValue = Math.Round(odds[0], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "3", CardType = "Pair:", CardValue = Math.Round(odds[1], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "4", CardType = "Two Pair:", CardValue = Math.Round(odds[2], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "5", CardType = "Three of a Kind:", CardValue = Math.Round(odds[3], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "6", CardType = "Straight:", CardValue = Math.Round(odds[4], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "7", CardType = "Flush:", CardValue = Math.Round(odds[5], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "8", CardType = "Full House:", CardValue = Math.Round(odds[6], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "9", CardType = "Four of a Kind:", CardValue = Math.Round(odds[7], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "10", CardType = "Straight Flush:", CardValue = Math.Round(odds[8], DEC_PLACES) });
            respmsg.Add(new ResponseMessage { SLNO = "11", CardType = "Royal Flush:", CardValue = Math.Round(odds[9], DEC_PLACES) });
            string sJSONResponse = JsonConvert.SerializeObject(respmsg);
            return sJSONResponse;
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
        public double CardValue { get; set; }
       
    }
}