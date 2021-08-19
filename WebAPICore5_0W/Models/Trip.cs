using System;
using System.Collections.Generic;

#nullable disable

namespace WebAPICore5_0W.Models
{
    public partial class Trip
    {
        public Trip()
        {
            Orders = new HashSet<Order>();
        }

        public int IdTrip { get; set; }
        public string StartLocation { get; set; }
        public string FinishLocation { get; set; }
        public int? Price { get; set; }
        public bool? Ordered { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
